/*
 * SmartWizard 2.0 plugin
 * jQuery Wizard control Plugin
 * by Dipu 
 * 
 * Modified by Yuan Xulei on Dec 2013.
 *
 * http://www.techlaboratory.net 
 * http://tech-laboratory.blogspot.com
 */

(function($) {
  $.fn.smartWizard = function(action) {
    var options = $.extend({}, $.fn.smartWizard.defaults, action);
    var args = arguments;

    return this.each(function() {
      var obj = $(this);
      var curStepIdx = options.selected;
      var steps = $("ul > li > a[href^='#step-']", obj); // Get all anchors in this array
      var contentWidth = 0;
      var elmStepContainer;

      // Method calling logic
      if (!action || action === 'init' || typeof action === 'object') {
        init();
      } else if (action === 'setError') {
        var ar = Array.prototype.slice.call(args, 1);
        setError(ar[0].stepnum, ar[0].iserror);
        return true;
      } else {
        $.error('Method ' + action + ' does not exist');
      }

      function init() {
        var allDivs = obj.children('div'); //$("div", obj);
        obj.children('ul').addClass("anchor");
        allDivs.addClass("content");
        // Create Elements
        elmStepContainer = $('<div></div>').addClass("stepContainer");

        // highlight steps with errors
        if (options.errorSteps && options.errorSteps.length > 0) {
          $.each(options.errorSteps, function(i, n) {
            setError(n, true);
          });
        }


        elmStepContainer.append(allDivs);
        obj.append(elmStepContainer);
        contentWidth = elmStepContainer.width();

        $(steps).bind("click", function(e) {
          if (steps.index(this) == curStepIdx) {
            return false;
          }
          var nextStepIdx = steps.index(this);
          var isDone = steps.eq(nextStepIdx).attr("isDone") - 0;
          if (isDone == 1) {
            LoadContent(nextStepIdx);
          }
          return false;
        });

        // Enable keyboard navigation
        if (options.keyNavigation) {
          $(document).keyup(function(e) {
            if (e.which == 39) { // Right Arrow
              doForwardProgress();
            } else if (e.which == 37) { // Left Arrow
              doBackwardProgress();
            }
          });
        }
        //  Prepare the steps
        prepareSteps();
        // Show the first slected step
        LoadContent(curStepIdx);
      }

      function prepareSteps() {
        if (!options.enableAllSteps) {
          $(steps, obj).removeClass("selected").removeClass("done").addClass("disabled");
          $(steps, obj).attr("isDone", 0);
        } else {
          $(steps, obj).removeClass("selected").removeClass("disabled").addClass("done");
          $(steps, obj).attr("isDone", 1);
        }

        $(steps, obj).each(function(i) {
          $($(this).attr("href"), obj).hide();
          $(this).attr("rel", i + 1);
        });
      }

      function LoadContent(stepIdx) {
        showStep(stepIdx);
      }

      function showStep(stepIdx) {
        var selStep = steps.eq(stepIdx);
        var curStep = steps.eq(curStepIdx);
        if (stepIdx != curStepIdx) {
          if ($.isFunction(options.onLeaveStep)) {
            if (!options.onLeaveStep.call(this, $(curStep))) {
              return false;
            }
          }
        }
        if (options.updateHeight)
          elmStepContainer.height($($(selStep, obj).attr("href"), obj).outerHeight());
        if (options.transitionEffect == 'slide') {
          $($(curStep, obj).attr("href"), obj).slideUp("fast", function(e) {
            $($(selStep, obj).attr("href"), obj).slideDown("fast");
            curStepIdx = stepIdx;
            SetupStep(curStep, selStep);
          });
        } else if (options.transitionEffect == 'fade') {
          $($(curStep, obj).attr("href"), obj).fadeOut("fast", function(e) {
            $($(selStep, obj).attr("href"), obj).fadeIn("fast");
            curStepIdx = stepIdx;
            SetupStep(curStep, selStep);
          });
        } else if (options.transitionEffect == 'slideleft') {
          var nextElmLeft = 0;
          var curElementLeft = 0;
          if (stepIdx > curStepIdx) {
            nextElmLeft1 = contentWidth + 10;
            nextElmLeft2 = 0;
            curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
          } else {
            nextElmLeft1 = 0 - $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
            nextElmLeft2 = 0;
            curElementLeft = 10 + $($(curStep, obj).attr("href"), obj).outerWidth();
          }
          if (stepIdx == curStepIdx) {
            nextElmLeft1 = $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
            nextElmLeft2 = 0;
            curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
          } else {
            $($(curStep, obj).attr("href"), obj).animate({
              left: curElementLeft
            }, "fast", function(e) {
              $($(curStep, obj).attr("href"), obj).hide();
            });
          }

          $($(selStep, obj).attr("href"), obj).css("left", nextElmLeft1);
          $($(selStep, obj).attr("href"), obj).show();
          $($(selStep, obj).attr("href"), obj).animate({
            left: nextElmLeft2
          }, "fast", function(e) {
            curStepIdx = stepIdx;
            SetupStep(curStep, selStep);
          });
        } else {
          $($(curStep, obj).attr("href"), obj).hide();
          $($(selStep, obj).attr("href"), obj).show();
          curStepIdx = stepIdx;
          SetupStep(curStep, selStep);
        }
        return true;
      }

      function SetupStep(curStep, selStep) {
        $(curStep, obj).removeClass("selected");
        $(curStep, obj).addClass("done");

        $(selStep, obj).removeClass("disabled");
        $(selStep, obj).removeClass("done");
        $(selStep, obj).addClass("selected");
        $(selStep, obj).attr("isDone", 1);
        if ($.isFunction(options.onShowStep)) {
          if (!options.onShowStep.call(this, $(selStep))) {
            return false;
          }
        }
        return true;
      }

      function doForwardProgress() {
        var nextStepIdx = curStepIdx + 1;
        if (steps.length <= nextStepIdx) {
          if (!options.cycleSteps) {
            return false;
          }
          nextStepIdx = 0;
        }
        LoadContent(nextStepIdx);
        return true;
      }

      function doBackwardProgress() {
        var nextStepIdx = curStepIdx - 1;
        if (0 > nextStepIdx) {
          if (!options.cycleSteps) {
            return false;
          }
          nextStepIdx = steps.length - 1;
        }
        LoadContent(nextStepIdx);
        return true;
      }

      function setError(stepnum, iserror) {
        if (iserror) {
          $(steps.eq(stepnum - 1), obj).addClass('error')
        } else {
          $(steps.eq(stepnum - 1), obj).removeClass("error");
        }
      }

      return false;
    });
  };

  // Default Properties and Events
  $.fn.smartWizard.defaults = {
    selected: 0, // Selected Step, 0 = first step
    keyNavigation: true, // Enable/Disable key navigation(left and right keys are used if enabled)
    enableAllSteps: false,
    updateHeight: true,
    transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
    cycleSteps: false, // cycle step navigation
    includeFinishButton: true, // whether to show a Finish button
    enableFinishButton: false, // make finish button enabled always
    errorSteps: [], // Array Steps with errors
    onLeaveStep: null, // triggers when leaving a step
    onShowStep: null, // triggers when showing a step
    onFinish: null // triggers when Finish button is clicked
  };

})(jQuery);
